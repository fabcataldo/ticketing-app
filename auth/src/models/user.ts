import mongoose from 'mongoose';
import { Password } from '../services/password';

// Here I wanted to create the User model, just using like:
// User.build({email: 'pepe@gmail.com', password: '1234'})
// there where 2 issues: Typescript didn't know
// about what are the attributes for creating a new user
// 2) Typescript didn't know about that every user must have 2 attributes: email and password

// an interface that describes the properties that are required to create a new user
interface UserAttrs {
    email: string;
    password: string;
}

// an interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// an interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__id;
            delete ret.__v;
        }
    }
});

userSchema.pre('save', async function(done) {
    // check if the user's password was modified
    // this is that we might be retrieving the user out of the
    // database and then trying to save it in the future

    // if we are creating a new User, the password that is being passing here
    // is a modified one, so it will go for this if

    if(this.isModified('password')){
        // in .toHash method, is being passed the password (in the get method)
        // of the document that we are passing here
        // here the password of the User's parameter is being hashed
        const hashed = await Password.toHash(this.get('password'));

        // update password of the User
        this.set('password', hashed);
    }

    // the asynchronius work finish
    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

// <DOCUMENT, MODEL>
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// the code below is for testing purposes, specifically for test upper code
// const user = User.build({
//     email: 'test@test.com',
//     password: 'password'
// });

export { User };