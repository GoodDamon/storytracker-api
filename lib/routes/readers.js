module.exports = (app) => {
    const routes = app.get('routes');
    const auth = app.get('auth');
    const { mongoose, User, Story } = app.get('dbInterface');

    app.route(routes.API_READERS)
        .all(auth)
        .post((req, res) => {
            const { storyId } = req.params;
            const user_id = req.decoded.data._id;
            const search = { storyId, user_id };
            query = Story.findOne(search)
                .then(story => {
                    const readerId = story.readers.length + 1;
                    req.body.readerId = readerId;
                    story.readers.push(req.body);
                    story.save()
                        .then(() => {
                            res.status(200).json({ success: true });
                        });
                })
                .catch(error => {
                    res.status(500).json({ success: false, error })
                });
        })
        .get((req, res) => {
            const { storyId } = req.params;
            const user_id = req.decoded.data._id;
            const query = Story.findOne({ storyId, user_id })
                .then(story => {
                    res.status(200).json({ success: true, items: story.readers })
                })
                .catch(error => {
                    res.status(500).json({ success: false, error });
                });
        })
        .put((req, res) => {
            const { storyId } = req.params;
            const user_id = req.decoded.data._id;

            const readers = req.body.readers.map((reader, index) => {
                reader.readerId = index + 1;
                return reader;
            });

            const search = { storyId, user_id };
            const query = Story.findOne(search)
                .then(story => {
                    story.readers = readers;
                    story.save()
                        .then(() => {
                            res.status(200).json({ success: true });
                        });
                })
                .catch(error => {
                    res.status(500).json({ success: false, error });
                });
        })
        .delete((req, res) => {
            const { storyId } = req.params;
            const user_id = req.decoded.data._id;

            const search = { storyId, user_id };
            const query = Story.findOne(search)
                .then(story => {
                    story.readers = [];
                    story.save()
                        .then(() => {
                            res.status(200).json({ success: true });
                        });
                })
                .catch(error => {
                    res.status(500).json({ success: false, error })
                });
        });

    app.route(routes.API_reader)
        .all(auth)
        .put((req, res) => {
            const { storyId, readerId } = req.params;
            const user_id = req.decoded.data._id;

            const search = { storyId, user_id };
            const query = Story.findOne(search)
                .then(story => {
                    const reader = story.readers.find(reader => reader.readerId === +readerId);
                    const keys = Object.keys(req.body);

                    keys.forEach(key => {
                        reader[key] = req.body[key];
                    });
                    story.save()
                        .then(() => {
                            res.status(200).json({ success: true });
                        });
                });
        })
        .get((req, res) => {
            const { storyId, readerId } = req.params;
            const user_id = req.decoded.data._id;
            const search = { storyId, user_id };
            query = Story.findOne(search)
                .then(story => {
                    const reader = story.readers.find(reader => reader.readerId === +readerId);
                    res.status(200).json({ success: true, items: reader });
                })
                .catch(error => {
                    res.status(500).json({ success: false, error });
                });
        })
        .delete((req, res) => {
            const { storyId, readerId } = req.params;
            const user_id = req.decoded.data._id;
            const search = { storyId, user_id };
            query = Story.findOne(search)
                .then(story => {
                    const index = story.readers.findIndex(reader => reader.readerId === +readerId);
                    story.readers.splice(index, 1);
                    story.readers.forEach(reader => {
                        if (reader.readerId > readerId) {
                            reader.readerId--;
                        }
                    });
                    story.save()
                        .then(() => {
                            res.status(200).json({ success: true });
                        });
                })
                .catch(error => {
                    res.status(500).json({ success: false, error });
                });
        });
};
