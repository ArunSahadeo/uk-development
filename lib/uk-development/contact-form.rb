module UKDevelopment
	class ContactForm

		def initialize
		end

		def retrieve_fields()
			fields = [
				{
					label: 'First Name',
					name: 'first_name',
					element: 'input',
					type: 'text',
					placeholder: 'First name',
					required: false
				},

				{
					label: 'Last Name',
					name: 'last_name',
					element: 'input',
					type: 'text',
					placeholder: 'Last name',
					required: false
				},

				{
					element: 'input',
					type: 'submit',
					value: 'Submit form'
				}
			]

			return fields
		end
	end
end
