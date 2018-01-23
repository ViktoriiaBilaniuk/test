import {NOTE} from './note';

export interface USER {
  firstName?: string;
  lastName?: string;
  department?: string;
  departmentId?: string;
  email?: string;
  skype?: string;
  room?: string;
  photo?: string;
  role?: number;
  pdps?: number[];
  _id?: string;
  notes?: Array<NOTE>;
  lastWorkingDay?: string;
  firstWorkingDay?: string;
  generalFirstWorkingDay?: string;
  photoOrigin?: string;
  phone?: string;
  _room?: any;
  _department?: any;
  _projects?: any;
  _lead?: any;
  _pdp?: any;
  _oneToOne?: any;
  _reason?: any;
  reason_comments?: any;
  birthday?: string;
  relocationCity?: string;
  defaultUserPhoto?: string;
  description?: string;
  trialPeriodEnds?: string;
  emergencyContact?: any;
  tr_isAdmin?: boolean;
}
