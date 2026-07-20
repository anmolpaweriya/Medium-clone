module.exports = function calculateReadTime(content) {

    const words = content
        .replace(/<[^>]*>/g, "")
        .trim()
        .split(/\s+/)
        .length;

    return Math.max(1, Math.ceil(words / 200));
};
