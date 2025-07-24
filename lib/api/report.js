// lib/api/report.js

import { fetchWithRetry } from '@/lib/utils/fetchWithRetry';
import { API_BASE_URL } from '@/lib/config';

// 📆 Haal lijst van beschikbare rapportdatums op
export const fetchReportDates = () =>
  fetchWithRetry(`${API_BASE_URL}/api/daily_report/history`, 'GET');

// 📄 Haal rapport op voor een specifieke datum of 'latest'
export const fetchReportByDate = (date) => {
  const endpoint =
    date === 'latest'
      ? `${API_BASE_URL}/api/daily_report/latest`
      : `${API_BASE_URL}/api/daily_report/${date}`;
  return fetchWithRetry(endpoint, 'GET');
};
