When /^I type url$/ do
  visit 'http://localhost:4567'

  page.driver.render "tmp/screenshot.png"

end
