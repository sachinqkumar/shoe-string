module.exports = {
    DBURL: process.env.connectAtlasCluster === 'true' ?
        `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_DB_PASSWORD}@${process.env.ATLAS_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority` :
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    DB_OPTIONS: {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
        autoReconnect: false,
    },
    secret: process.env.JWT_SECRET,
}