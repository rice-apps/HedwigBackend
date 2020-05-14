import { Vendor, VendorTC } from '../models';

const VendorQuery = {
    vendorOne: VendorTC.getResolver('findOne')
};

const VendorMutation = {
    vendorCreateOne: VendorTC.getResolver('createOne')
};

export { VendorQuery, VendorMutation };