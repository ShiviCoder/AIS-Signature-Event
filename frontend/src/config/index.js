import { BASE_URL } from './baseUrl';
import { fetchEvents } from './eventsApi';
import { fetchCategories } from './eventsApi';
import { fetchEventById } from './eventsApi';
import { saveEvent } from './eventsApi';
import { unsaveEvent } from './eventsApi';
import apiClient from './apiClient';
export { 
  fetchEvents, 
  fetchCategories, 
  fetchEventById, 
  saveEvent, 
  unsaveEvent 
} from './eventsApi';

const api = {
  BASE_URL,
  apiClient,
  fetchEvents,
  fetchCategories,
  fetchEventById,
  saveEvent,
  unsaveEvent,
};
export default api;