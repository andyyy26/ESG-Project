/**
 * List all
 * GET
 */
exports.list = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'List all data',
        data: {},
      });
};