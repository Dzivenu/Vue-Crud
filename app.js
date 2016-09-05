// app.js

new Vue({
	el: "#events",

	data: {
		columns:[
			'__actions',
			'title',
			'name',
			'email',
			'phone',
			'address',
			'company'
		],
		tableaction:[
			{name: 'edit-item',label:'',icon:'edit icon',class:'ui orange icon button'},
			{name: 'delete-item',label:'',icon:'delete icon',class:'ui red icon button'}
		],
		event:{title: '',name: '',email: '',phone: '',address: '',company: ''},
		events:[],
		showModal: false
	},

	ready: function() {
		// this.fetchEvents();
	},

	methods: {
		findEvent : function() {

		},
		addEvent : function() {
			if(this.event.title.trim()){
				this.$http.post('/api/contact',this.event).then(function(response){
					if(response.statusText == 'OK') {
						location.reload();
					}else{
						alert('ada kesalahan terjadi !');
					}
				});
			}
		},
		editEvent : function() {
			this.$http.put('/api/contact/' + this.event.contact_id,this.event).then(function(response){
				if(response.statusText == 'OK') {
					location.reload();
				}else{
					alert('ada kesalahan terjadi !');
				}
			});
		},
		deleteEvent: function(contact_id){
			if(confirm("Yakin mo ngapus lo bro ?")){
				this.$http.delete('/api/contact/'+ contact_id).then(function(response){
					if (response.statusText == 'OK') {
						location.reload();
					} else {
						alert('ada kesalahan terjadi !');
					}
				});
			}
		}
	},
	events: {
		'vuetable:action': function(action,data) {
			if(action == 'delete-item') {
				this.deleteEvent(data._id);
			}else if(action == 'edit-item'){
				$('#modal input#contact_id').val(data._id).trigger('change');
				$('#modal input#title').val(data.title).trigger('change');
				$('#modal input#name').val(data.name).trigger('change');
				$('#modal input#email').val(data.email).trigger('change');
				$('#modal input#phone').val(data.phone).trigger('change');
				document.getElementById('address').value = data.address;
				$('#modal #address').trigger('change');
				$('#modal input#company').val(data.company).trigger('change');
				$('.ui.modal').modal('show');
			}
		},
	}
});

