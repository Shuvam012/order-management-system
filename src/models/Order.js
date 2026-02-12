import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null

    },
    items: {
        type: String,
        quantity: Number,
        
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'on_the_way', 'in_progress', 'completed','rejected'],
        default: 'pending'
    },
   totalAmount:{
       type: Number ,
       required: true
   }
},
    {
        timestamps: true
    }
);

export default mongoose.model('Order', orderSchema);
