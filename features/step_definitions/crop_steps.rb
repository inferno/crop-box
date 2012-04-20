# encoding: utf-8

Допустим /^я загружаю страницу$/ do
  visit('/')
end

И /^открываю виджет$/ do
  find('#anchor').click
  page.should have_css('#crop-box')
end

И /^нажимаю на кнопку кадрирования$/ do
  find('#crop-box').find(:xpath, "//span[@class='b-crop-box__send']").click
end

И /^результатом должна явиться кадрированная картинка$/ do
  page.should have_css('#cropped-img')
end
