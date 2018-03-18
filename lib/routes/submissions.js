module.exports = (app) => {
    const routes = app.get('routes');
    const auth = app.get('auth');
    const { mongoose, User, Story } = app.get('dbInterface');

    app.route(routes.API_SUBMISSIONS)
        .all(auth)
        .post((req, res) => {
            const { storyId } = req.params;
            const user_id = req.decoded.data._id;
            const search = { storyId, user_id };
            query = Story.findOne(search)
                .then(story => {
                    const subId = story.submissions.length + 1;
                    req.body.subId = subId;
                    story.submissions.push(req.body);
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
                    res.status(200).json({ success: true, items: story.submissions })
                })
                .catch(error => {
                    res.status(500).json({ success: false, error });
                });
        })
        .put((req, res) => {
            const { storyId } = req.params;
            const user_id = req.decoded.data._id;

            const submissions = req.body.submissions.map((submission, index) => {
                submission.subId = index + 1;
                return submission;
            });

            const search = { storyId, user_id };
            const query = Story.findOne(search)
                .then(story => {
                    story.submissions = submissions;
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
                    story.submissions = [];
                    story.save()
                        .then(() => {
                            res.status(200).json({ success: true });
                        });
                })
                .catch(error => {
                    res.status(500).json({ success: false, error })
                });
        });

    app.route(routes.API_SUBMISSION)
        .all(auth)
        .put((req, res) => {
            const { storyId, subId } = req.params;
            const user_id = req.decoded.data._id;

            const search = { storyId, user_id };
            const query = Story.findOne(search)
                .then(story => {
                    const submission = story.submissions.find(submission => submission.subId === +subId);
                    const keys = Object.keys(req.body);

                    keys.forEach(key => {
                        submission[key] = req.body[key];
                    });
                    story.save()
                        .then(() => {
                            res.status(200).json({ success: true });
                        });
                });
        })
        .get((req, res) => {
            const { storyId, subId } = req.params;
            const user_id = req.decoded.data._id;
            const search = { storyId, user_id };
            query = Story.findOne(search)
                .then(story => {
                    const submission = story.submissions.find(submission => submission.subId === +subId);
                    res.status(200).json({ success: true, items: submission });
                })
                .catch(error => {
                    res.status(500).json({ success: false, error });
                });
        })
        .delete((req, res) => {
            const { storyId, subId } = req.params;
            const user_id = req.decoded.data._id;
            const search = { storyId, user_id };
            query = Story.findOne(search)
                .then(story => {
                    const index = story.submissions.findIndex(submission => submission.subId === +subId);
                    story.submissions.splice(index, 1);
                    story.submissions.forEach(submission => {
                        if (submission.subId > subId) {
                            submission.subId--;
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
