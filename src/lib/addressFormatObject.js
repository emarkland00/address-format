function AddressFormatOptions(opts) {
    opts = opts || {};
    this.title = opts.title || '';
    this.honorific = opts.honorific || '';
    this.firstName = opts.firstName || '';
    this.middleName = opts.middleName || '';
    this.lastName = opts.lastName || '';
    this.secondLastName = opts.secondLastName || '';
    this.companyName = opts.companyName || '';
    this.streetNumber = opts.streetNumber || '';
    this.streetName = opts.streetName || '';
    this.address1 = opts.address1 || '';
    this.address2 = opts.address2 || '';
    this.apartmentNumber = opts.apartmentNumber || '';
    this.city = opts.city || '';
    this.state = opts.state || '';
    this.postalCode = opts.postalCode || '';
    this.country = opts.country || '';
    this.countryCode = opts.countryCode || '';
    this.countryAbbreviation = opts.countryAbbreviation || '';
    this.province = opts.province || '';
    this.prefecture = opts.prefecture || '';
    this.jobTitle = opts.jobTitle || '';
    this.region = opts.region || '';
    this.reference = {};
    this.options = opts;
    return this;
}

exports.AddressFormatOptions = AddressFormatOptions;