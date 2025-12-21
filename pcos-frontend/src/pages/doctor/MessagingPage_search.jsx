// Add this at line 13 after the other state declarations:
const [searchQuery, setSearchQuery] = useState('');

// Add this after line 131 (before handleSendMessage):
// Filter conversations based on search query
const filteredConversations = conversations.filter((conv) => {
  if (!searchQuery.trim()) return true;
  const query = searchQuery.toLowerCase();
  const fullName = `${conv.partner.firstName} ${conv.partner.lastName}`.toLowerCase();
  const lastMessageContent = conv.lastMessage?.content?.toLowerCase() || '';
  return fullName.includes(query) || lastMessageContent.includes(query);
});

// Replace conversations.map at line 162 with filteredConversations.map
// Add search input before the conversations list around line 160
