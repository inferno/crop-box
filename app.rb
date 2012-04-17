require 'sinatra'
require 'sinatra/reloader'
require 'base64'
require 'pp'

set :reload_templates, true
set :public_folder, File.dirname(__FILE__) + '/public'

get '/' do
  haml :index, :format => :html5
end

get '/crop' do
  'Post request required!'
end

post '/crop' do
  logger.info 'crop'
  file = Base64.decode64(params[:cropped_file].split(',')[1])

  fname = "/cropped/#{Time.new.to_i}.png"

  File.open("public#{fname}", 'w') do |f|
    f.write(file)
  end

  fname


end
