import dayjs from 'dayjs/esm';

import { IPost, NewPost } from './post.model';

export const sampleWithRequiredData: IPost = {
  id: 35989,
};

export const sampleWithPartialData: IPost = {
  id: 79841,
  likes: 60570,
  affordability: 92413,
  shelfLife: 23240,
};

export const sampleWithFullData: IPost = {
  id: 75723,
  postTitle: 'Agent intelligence',
  postPic: '../fake-data/blob/hipster.png',
  postPicContentType: 'unknown',
  postDesc: 'Cambridgeshire',
  timestamp: dayjs('2023-03-07T04:51'),
  likes: 44851,
  affordability: 82158,
  simplicity: 79081,
  shelfLife: 60940,
};

export const sampleWithNewData: NewPost = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
