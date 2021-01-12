import axios from 'axios';

export default {
  async get(url) {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      throw err.response.data;
    }
  },
  async post(url, payload) {
    try {
      const res = await axios.post(url, payload);
      return res.data;
    } catch (err) {
      throw err.response.data;
    }
  },
  async delete(url) {
    try {
      const res = await axios.delete(url);
      return res.data;
    } catch (err) {
      throw err.response.data;
    }
  },
};
