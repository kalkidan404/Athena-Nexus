// GitHub URL validation
export const isValidGitHubUrl = (url) => {
  const githubRegex = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+$/;
  return githubRegex.test(url);
};

// General URL validation
export const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

// Password validation
export const isValidPassword = (password) => {
  // 8+ characters, letters + numbers
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

