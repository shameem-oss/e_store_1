import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: true, 
    minlength: [4, "Password must be at least 4 characters long"] 
  },
  image:[{type:String}],
  profile_avatar: {
    type: String,
    default: function () {
      return `https://robohash.org/${this.last_name}`;
    },
  },
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }]

});

const UserModel = model("User", userSchema); // ✅ Capitalized Model Name
export default UserModel;
