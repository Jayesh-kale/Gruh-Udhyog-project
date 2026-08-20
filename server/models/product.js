const mongoose = require("mongoose");

const product = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      default: null,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      url: {
        type: String,
        default: ""
      },
      public_id: {
        type: String,
        default: ""
      }
    },

    defaultOnlinePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      enum: ["kg", "g", "ml", "pcs", "packet"],
      required: true,
      trim: true,
    },

    isListedOnline: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    displayOrder: { //optional field 
      type: Number,
      default: 0
    },

    isSeasonal: {
      type: Boolean,
      default: false,
    },

    season: {
      type: String,
      default: null,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

product.index({

  name: 1

});

product.index({

  category: 1

});

product.index({

  type: 1

});

product.index({

  isActive: 1

});

product.index({

  isListedOnline: 1

});

product.index({

  isSeasonal: 1

});

product.index({

  season: 1

});

product.index({

  category: 1,

  type: 1

});

module.exports = mongoose.model("Product", product);