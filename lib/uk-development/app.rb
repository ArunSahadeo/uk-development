module UKDevelopment
	class App < Sinatra::Base
		
		get '/' do
			erb :home
		end

	end
end
