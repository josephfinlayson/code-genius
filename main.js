Comments = new Meteor.Collection("comments");

/*
Comments.allow is a function.

It takes a bunch of functions.

Each of the functions it takes has a name that is the 
same as a function we're going to use later on, attached to 
the comments object.

The function we attach to that name defines a conditional
statement which decides whether the function name can run.

*/ 
Comments.allow( {
  insert : function () {
    return !(Meteor.user()==null);
  }
})



// All of this ONLY runs inside the client.
if (Meteor.isClient) {
  /*
  Template is a object which meteor provides. We use it alongside
  corresponding 'template' definitions inside our html. e.g. 

  <template name="comments">
    {{#each comment}}
      <div class ="comment_container">  
        {{comment_text}}
        {{userEmail}}
      </div>
    {{/each}}
  </template>

  Handlebars is used extensively here. Handlebars is a 
  specification format (pointers to non-existent html) for 
  dynamic creation of html elemnts. It doesn't care about 
  compilers.
  */
  Template.comments.comment_array = function () {
    return Comments.find({},  {sort: { date : -1 } });
  };   

// TODO: REPLACE WITH AN EVENT TRIGGERED BY ANNOTATOR.JS 

  /* Again, Template.addbutton is a template in the html
  events references the DOM_SPECIFICATION (google it) events
  Any template will have this 'events' thing. 

  */

  /*

  Template.addbutton.events = {

    // click  is a click event. input specifies look for an
    // input element # means the id add_comment

    // THIS IS WEIRD BUT COOL! METEOR MAGIC MEANS THAT THE 
    // NAME OF THE FUNCTION IS THE EVENT YOU ARE LISTENING TO

    'click input#add_comment': function () {
      var comment_text = jQuery('#new_comment')
      console.log(comment_text)
      Comments.insert({
        comment_text: comment_text.val(),
        date: new Date().getTime(),
        userEmail: Meteor.user().emails[0].address,
      });
      comment_text.val("")
};
    }*/

/* George's understanding of this bit (Joe, correct me if I'm wrong?)
- jQuery: a JS library "designed to simplify the client-side scripting of HTML"
- $: just a variable name. It refers to the JQuery object:
-    // The jQuery object is actually just the init constructor 'enhanced' 
- Basically, we're just initialising annotator.js (which )
*/


/* This should probably be a in a seperate file */
// I've followed this: http://docs.annotatorjs.org/en/latest/hacking/plugin-development.html
// It's deeply confusing. 
Annotator.Plugin.AnnotationToComment = function (element, message) {
  return {
    pluginInit: function () {
      this.annotator
          .subscribe("annotationCreated", function (annotation) {// Annotation created event! 
            Comments.insert({
              // annotation: annotation, // This would be nice, but gives an Uncaught RangeError
              text: annotation.text,
              date: new Date().getTime(),
              userEmail: Meteor.user().emails[0].address,
              ranges: annotation.ranges,
              quote: annotation.quote
            });
            console.info("The annotation: %o has just been created!", annotation)
          })
          .subscribe("annotationUpdated", function (annotation) {
            console.info("The annotation: %o has just been updated!", annotation)
          })
          .subscribe("annotationDeleted", function (annotation) {
            console.info("The annotation: %o has just been deleted!", annotation)
          });
    }
  }
}


jQuery(document).ready(function($) {
  $('.post-text').annotator()
                 .annotator('addPlugin','AnnotationToComment')
                 /*.annotator('setupPlugins')*/;
});

}

if (Meteor.isServer) {
  Meteor.startup(function () {
  //allows for authentication with annotation libraries
  Meteor.require('jwt-simple')
  return Meteor.methods({
      // Meteor.call('removeAllPosts')
      // From the console, this will remove all stored posts.

      removeAllPosts: function() { 
            return Comments.remove({});
      }
  })
  });
}
