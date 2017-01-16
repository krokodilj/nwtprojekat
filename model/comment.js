var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    data: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    //ako se komentar odnosi na event ovo ce biti id eventa
    eventId: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    //ako se komentar odnosi na drugi komentar ovo ce biti njegov id
    commentId: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
})

schema.pre('save', function (next) {
    this.date = new Date();
    next();
});

schema.pre('findOne', function (next) {
    this.populate('commentId');
    this.populate('author')
    next();
});

schema.pre('find', function (next) {
    this.populate('commentId');
    this.populate('author');
    next();
});

module.exports = mongoose.model('Comment', schema);