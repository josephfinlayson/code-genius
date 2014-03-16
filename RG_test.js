Comments = new Meteor.Collection("comments");

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
      date: new Date().getTime()
    });
    comment_text.val("")
  }
};

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // Comments.remove({});
    // code to run on server at startup
  });
}
