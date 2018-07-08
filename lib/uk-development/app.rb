module UKDevelopment
	class App < Sinatra::Base

		configure do
			set :contactEmail, 'arunjamessahadeo@gmail.com'

			time = Time.new
			set :year, time.year
		end
		
		get '/' do
			erb :home
		end

		get '/about' do
			erb :about
		end

		get '/contact' do
			contactForm = ContactForm.new
			@fields = contactForm.retrieve_fields()
			erb :contact
		end

	end
end
