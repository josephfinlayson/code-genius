Comments = new Meteor.Collection("comments");

Comments.allow( {
  insert : function () {
    return !(Meteor.user()==null);
  }
})



if (Meteor.isClient) {
  Template.comments.comment = function () {
    console.log(Comments.find({},  {sort: { date : -1 } }))
    return Comments.find({},  {sort: { date : -1 } });
  };   


Template.addbutton.events = {
  'click input#add_comment': function () {
    var comment_text = jQuery('#new_comment')
    console.log(comment_text)
    Comments.insert({
      comment_text: comment_text.val(),
      date: new Date().getTime(),
      userEmail: Meteor.user().emails[0].address
    });
    comment_text.val("")
  }
};

jQuery(document).ready(function($) {
  $('.post-text').annotator();  
});

}

if (Meteor.isServer) {
  Meteor.startup(function () {
  //allows for authentication with annotation libraries
  Meteor.require('jwt-simple')
  });
}
