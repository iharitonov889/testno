const generateToken = (length) => {
  const rand = () => Math.random(0).toString(36).substr(2);
  const token = (rand() + rand() + rand() + rand()).substr(0, length);
  return token;
};
module.exports = { generateToken };
