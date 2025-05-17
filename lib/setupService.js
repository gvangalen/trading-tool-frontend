// lib/setupService.js
import { API_BASE_URL } from '@/lib/config';

// 🔁 Setup lijst ophalen
export async function fetchSetups() {
  const res = await fetch(`${API_BASE_URL}/api/setups`);
  if (!res.ok) throw new Error('❌ Fout bij ophalen van setups');
  return res.json();
}

// ⭐ Top 3 setups ophalen
export async function fetchTopSetups(limit = 3) {
  const res = await fetch(`${API_BASE_URL}/api/setups/top?limit=${limit}`);
  if (!res.ok) throw new Error('❌ Fout bij ophalen van top setups');
  return res.json();
}

// ✅ Setup bijwerken (PUT)
export async function updateSetup(id, updatedData) {
  const res = await fetch(`${API_BASE_URL}/api/setups/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) throw new Error('❌ Fout bij bijwerken setup');
  return res.json();
}

// 🗑️ Setup verwijderen (DELETE)
export async function deleteSetup(id) {
  const res = await fetch(`${API_BASE_URL}/api/setups/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('❌ Fout bij verwijderen setup');
  return res.json();
}
