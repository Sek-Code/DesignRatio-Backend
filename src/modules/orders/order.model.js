import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    order_no: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      default: function() {
        const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `DR-${date}-${random}`;
      }
    },
    
    user_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true 
    },

    order_items: [
      {
        product_id: { type: String, required: true },
        type: { type: String, enum: ["ready", "custom"], required: true },
        name: { type: String, required: true },
        size: { type: String, enum: ["S", "M", "L"], required: true },
        quantity: { type: Number, required: true, min: 1 },
        
        // สำหรับ custom tea เท่านั้น
        bases: [
          {
            name: { type: String }
          }
        ],
        ingredients: [
          {
            component_id: { type: String },
            name: { type: String },
            category: { type: String }
          }
        ],
        ingredients_total_price: { type: Number, default: 0 }
      }
    ],

    delivery_option: {
      delivery_id: { type: String, required: true },
      name: { type: String, required: true }
    },

    payment_option: {
      method: { 
        type: String, 
        enum: ["QR Code", "Credit Card", "Cash"], 
        required: true 
      }
    },

    status_order: {
      payment_status: { 
        type: String, 
        enum: ["pending", "paid", "failed"], 
        default: "pending" 
      },
      delivery_status: { 
        type: String, 
        enum: ["preparing", "shipped", "delivered", "cancelled"], 
        default: "preparing" 
      }
    },

    grandTotal: { 
      type: Number, 
      required: true, 
      min: 0 
    }
  },
  {
    timestamps: true
  }
);

export const Order = mongoose.model("Order", orderSchema);
