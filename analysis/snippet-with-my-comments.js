exports.inviteUser = function(req, res){
	var invitationBody = req.body;
	var shopId = req.params.shopId;
	var authUrl = "https://url.to.auth.system.com/invitation";
	superagent
		.post(authUrl)
			.send(invitationBody)
			.end(function(err, invitationResponse){
				/*
				Add err checking here e.g.
				if (err || !invitationResponse.ok) {
					return res.status(500).JSON(err);
				} else if (invitationResponse.status === 201)...
				*/
				if (invitationResponse.status === 201) {
					/*
					Improve testability by making the below a function
					that gets called
					*/
					User.findOneAndUpdate ({
						//query
						authId: invitationResponse.body.authId
					}, {
						//update
						authId: invitationResponse.body.authId,
						email: invitationBody.email
					}, {
						//options
						upsert: true,
						new: true
					}, function(err, createdUser){
						/*
						Add err checking here e.g.
						if (err) {
							return res.status(500).send(err || {message:'User update failed'});
						} else {
							updateShop(invitationResponse, createdUser);
						}

						Improve testability by wrapping the below in a function
						that takes invitationResponse and createdUser as an argument
						*/
						Shop.findById(shopId).exec(function(err, shop){
							if (err || !shop) {
							  return res.status(500).send(err || {message:'No shop found'});
						  	}
							/*
							Below says if shop has inviteId then push same inviteId.
							Should do check with: '...Id) === -1' '
							*/
							if (shop.invitations.indexOf(invitationResponse.body.invitationId)){
								shop.invitations.push(invitationResponse.body.invitationId);
							}
							if (shop.users.indexOf(createdUser._id) === - 1){
								shop.users.push(createdUser);
							}
							shop.save();
						});
					});
				} else if (invitationResponse.status === 200){
					res.status(400).json ({
						error: true,
						message: 'User already invited to this shop'
					});
					return;
				}
				res.json(invitationResponse);
			});
};
