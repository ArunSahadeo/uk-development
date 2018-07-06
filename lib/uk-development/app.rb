module UKDevelopment
	class App < Sinatra::Base
		
		get '/' do
			erb :home
		end

		get '/about' do
			@contactEmail = 'arunjamessahadeo@gmail.com'
			erb :about
		end

		get '/contact' do
			contactForm = ContactForm.new
			@fields = contactForm.retrieve_fields()
			erb :contact
		end

	end
end
