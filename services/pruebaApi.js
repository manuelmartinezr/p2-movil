import { DataService } from './DataService.js';

const version = DataService.bumpApiVersion();
console.log('Bumped API version:', version.version);