const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'contacts.json');

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

function readContacts() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeContacts(contacts) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(contacts, null, 2));
}

app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required' });
  }

  const contact = {
    id: Date.now().toString(),
    name: name.trim(),
    email: email.trim(),
    phone: phone?.trim() || '',
    message: message?.trim() || '',
    createdAt: new Date().toISOString()
  };

  const contacts = readContacts();
  contacts.unshift(contact);
  writeContacts(contacts);

  res.json({ success: true, message: 'Contact submitted successfully', data: contact });
});

app.get('/api/contact', (req, res) => {
  const contacts = readContacts();
  res.json({ success: true, data: contacts });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});