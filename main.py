import json
from os import path
from selenium import webdriver
from script import login, attend


with open("config.json") as file:
    config = json.load(file)

PATH = path.join('driver', 'geckodriver.exe')
driver = webdriver.Firefox(executable_path=PATH)

login(driver, config)
attend(driver)
