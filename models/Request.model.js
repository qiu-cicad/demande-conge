const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const requestSchema = new Schema(
  {
    title: {
      type: String,
    },
    type: { 
      type: String, 
      required: [true, "Vacation type is required"] 
    },
    duration: {
      type: Number,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required."],
    },
    startWholeDay: {
      type: Boolean,
      required: [true, "Choice is required."],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    endWholeDay: {
      type: Boolean,
      required: [true, "Choice is required."],
    },
    requestor: { 
      type: String, 
      required: [true, "Requestor is required"] 
    },
    validators:{
      type:String,
      required: [true, "put all vallidators' email here, separate with ; "]
    },
    hr:{
      type:String ,
      default:"vbavoux@cicad.fr"
    },
    sub:{
      type:String,
      required:false,
    },
    comments: {
      type: String,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  },
);

module.exports = model("Request", requestSchema);
