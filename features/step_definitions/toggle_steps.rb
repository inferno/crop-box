# encoding: utf-8

Допустим /^закрываю виджет$/ do
  find('body').click
end

Допустим /^результатом должен явиться закрытый виджет$/ do
  #page.should page.evaluate_script("$('#crop-box').is(':visible')") === false
  #page.driver.render "tmp/screenshot.png"
end
