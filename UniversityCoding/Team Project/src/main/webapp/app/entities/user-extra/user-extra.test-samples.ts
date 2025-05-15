import { IUserExtra, NewUserExtra } from './user-extra.model';

export const sampleWithRequiredData: IUserExtra = {
  id: 70254,
};

export const sampleWithPartialData: IUserExtra = {
  id: 95119,
  profilePic: '../fake-data/blob/hipster.png',
  profilePicContentType: 'unknown',
  profileBanner: '../fake-data/blob/hipster.png',
  profileBannerContentType: 'unknown',
};

export const sampleWithFullData: IUserExtra = {
  id: 28084,
  profilePic: '../fake-data/blob/hipster.png',
  profilePicContentType: 'unknown',
  biography: 'THX Pennsylvania array',
  profileBanner: '../fake-data/blob/hipster.png',
  profileBannerContentType: 'unknown',
  age: 91172,
  pronouns: 'Research grid-enabled New',
};

export const sampleWithNewData: NewUserExtra = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
