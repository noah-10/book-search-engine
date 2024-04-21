// import user model
const { User } = require('../models');
// import sign token function for auth
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user){
                return User.findOne({ _id: context.user._id}).populate('savedBooks');
            }else{
                console.log('Error getting ME');
                return;
            }
        },
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            console.log('email', email);
            console.log('password', password);
            const user = await User.findOne({ email });

            if(!user){
                console.log("No account found");
                return;
            };

            const checkPassword = await user.isCorrectPassword(password);

            if(!checkPassword){
                console.log('Password wrong');
                return;
            };

            const token = signToken(user);

            return { token, user };
        },

        addUser: async (parent, { username, email, password }) => {
            console.log(username, email, password)
            const user = await User.create({
                username,
                email,
                password
            });

            if(!user){
                console.log('Something is wrong');
                return;
            }

            const token = signToken(user);

            console.log("token", token);

            return { token, user };
        },

        saveBook: async (parent, {input}, context) => {
            console.log("bookInput", input);
            try{
                if(context.user){
                    const savedBook = await User.findOneAndUpdate(
                        { _id: context.user._id},
                        { $addToSet: { savedBooks: input }},
                        { new: true, runValidators: true }
                    );
                    return savedBook;
                }    
            }catch(err){
                console.log(err);
                return err
            }
        },

        removeBook: async (parent, { book }, context) => {
            const updatedUser = await User.findOneAndDelete(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: book }}},
                { new: true }
            );

            if(!updatedUser){
                return console.log('Error no user')
            };

            return updatedUser;
        }
    }
}

module.exports = resolvers;