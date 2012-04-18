require 'rubygems'
require 'cucumber/rake/task'

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

desc "build the docco documentation"
task :doc do
  check 'docco', 'docco', 'https://github.com/jashkenas/docco'
  system 'docco public/js/jquery.cropbox.js'
end

Cucumber::Rake::Task.new do |t|
  t.cucumber_opts = %w{--format pretty}
end

# Check for the existence of an executable.
def check(exec, name, url)
  return unless `which #{exec}`.empty?
  puts "#{name} not found.\nInstall it from #{url}"
  exit
end
