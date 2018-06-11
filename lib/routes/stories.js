module.exports = (app) => {
    const routes = app.get('routes');
    const auth = app.get('auth');
    const { mongoose, User, Story } = app.get('dbInterface');

    app.route(routes.API_STORIES)
        .all(auth)
        .post((req, res) => {
            const user_id = req.decoded.data._id;
            Story.find({ user_id }).then(stories => {
                const storyId = stories.length + 1;
                const { title, words, genre, status, comments } = req.body;
                const story = new Story({ user_id, storyId, title, words, genre, status, comments });
                story.save()
                    .then(() => {
                        res.status(200).json({ success: true });
                    })
                    .catch(error => {
                        res.status(500).json({ success: false, error });
                    });
            })
            .catch(error => {
                res.status(500).json({ success: false, error });
            })
        })
        .get((req, res) => {
            Story.find({})
                .then(items => {
                    items.sort((a,b) => {
                        return a.storyId - b.storyId;
                    });
                    res.status(200).json({ success: true, items })
                })
                .catch(error => {
                    res.status(500).json({ success: false, error });
                });
        })
        .put((req, res) => {
            const promises = req.body.stories.map(story => {
                story.user_id = req.decoded.data._id;
                const search = { storyId: story.storyId, user_id: story.user_id };
                return Story.findOneAndUpdate(search, story, { upsert: true })
                    .then(result => {
                        return result;
                    });
            });

            Promise.all(promises)
                .then(() => {
                    res.status(200).json({ success: true });
                })
                .catch(error => {
                    res.status(500).json({ success: false, error });
                });
        })
        .delete((req, res) => {
            const user_id = req.decoded.data._id;
            Story.remove({ user_id })
                .then(() => {
                    res.status(200).json({ success: true });
                })
                .catch(error => {
                    res.status(500).json({ success: false, error });
                });
        });

    app.route(routes.API_STORY)
        .all(auth)
        .put((req, res) => {
            const user_id = req.decoded.data._id;
            const { storyId } = req.params;
            req.body.storyId = storyId;
            req.body.user_id = user_id;
            const search = { storyId, user_id };
            Story.findOneAndUpdate(search, req.body, { upsert: true })
                .then(() => {
                    res.status(200).json({ success: true });
                })
                .catch(error => {
                    res.status(500).json({ success: false, error });
                });
        })
        .get((req, res) => {
            const user_id = req.decoded.data._id;
            const search = { storyId: req.params.storyId, user_id };
            query = Story.findOne(search)
                .then(story => {
                    res.status(200).json({ success: true, story });
                })
                .catch(error => {
                    res.status(500).json({ success: false, error });
                });
        })
        .delete((req, res) => {
            const user_id = req.decoded.data._id;
            const { storyId } = req.params;
            Story.remove({ user_id, storyId }, err => {
                if (err) {
                    return res.status(500).json({ success: false, error });
                }
                Story.find({ user_id })
                    .then(items => {
                        const promises = items.map(item => {
                            if (item.storyId > storyId) {
                                item.storyId--;
                                return item.save();
                            }
                            return true;
                        });

                        Promise.all(promises)
                            .then(() => {
                                res.status(200).json({ success: true });
                            });
                    });
            });
        });
};
