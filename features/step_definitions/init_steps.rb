# encoding: utf-8

Если /^я нажимаю на якорь$/ do
  visit 'http://localhost:4567'
  click_link 'anchor'
  assert page.has_selector?('.b-crop-box')

  #page.driver.render "tmp/screenshot.png"

end

#When /^I type url$/ do
#  visit 'http://localhost:4567'
#
#  page.driver.render "tmp/screenshot.png"
#
#end
