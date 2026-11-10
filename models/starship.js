import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import idPlugin from 'mongoose-id';

const starshipSchema = new mongoose.Schema({
  flight_number: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['suborbital', 'orbital-test'],
    default: 'orbital-test',
  },
  date_utc: {
    type: String,
    default: null,
  },
  date_unix: {
    type: Number,
    default: null,
  },
  ship_serial: {
    type: String,
    default: null,
  },
  booster_serial: {
    type: String,
    default: null,
  },
  launchpad: {
    type: String,
    default: null,
  },
  success: {
    type: Boolean,
    default: null,
  },
  hot_staging: {
    type: Boolean,
    default: null,
  },
  booster_recovery: {
    type: String,
    default: null,
  },
  ship_recovery: {
    type: String,
    default: null,
  },
  details: {
    type: String,
    default: null,
  },
  links: {
    webcast: {
      type: String,
      default: null,
    },
    youtube_id: {
      type: String,
      default: null,
    },
    article: {
      type: String,
      default: null,
    },
  },
}, { autoCreate: true });

starshipSchema.plugin(mongoosePaginate);
starshipSchema.plugin(idPlugin);

const Starship = mongoose.model('Starship', starshipSchema);

export default Starship;

