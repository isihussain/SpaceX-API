import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import idPlugin from 'mongoose-id';

const raptorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['sea-level', 'vacuum'],
    required: true,
  },
  status: {
    type: String,
    enum: ['retired', 'active', 'in-development'],
    default: 'active',
  },
  thrust_sea_level: {
    kN: {
      type: Number,
      default: null,
    },
    lbf: {
      type: Number,
      default: null,
    },
  },
  thrust_vacuum: {
    kN: {
      type: Number,
      default: null,
    },
    lbf: {
      type: Number,
      default: null,
    },
  },
  chamber_pressure_bar: {
    type: Number,
    default: null,
  },
  dry_weight_kg: {
    type: Number,
    default: null,
  },
  isp: {
    sea_level: {
      type: Number,
      default: null,
    },
    vacuum: {
      type: Number,
      default: null,
    },
  },
  propellants: {
    oxidizer: {
      type: String,
      default: 'Liquid Oxygen',
    },
    fuel: {
      type: String,
      default: 'Liquid Methane',
    },
  },
  cycle: {
    type: String,
    default: 'Full-flow staged combustion',
  },
  description: {
    type: String,
    default: null,
  },
}, { autoCreate: true });

raptorSchema.plugin(mongoosePaginate);
raptorSchema.plugin(idPlugin);

const Raptor = mongoose.model('Raptor', raptorSchema);

export default Raptor;
