require 'rubygems'

desc "rebuild the jquery.cropbox.min.js files for distribution"
task :build do
  begin
    require 'closure-compiler'
  rescue LoadError
    puts "closure-compiler not found.\nInstall it by running 'gem install closure-compiler'"
    exit
  end
  source = File.read 'public/js/jquery.cropbox.js'
  File.open('public/js/jquery.cropbox.min.js', 'w+') do |file|
    file.write Closure::Compiler.new.compress(source)
  end
end