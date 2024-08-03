import sys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import ElementClickInterceptedException
import time


chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument("--headless")

#預設是否顯示通知
prefs = {
    'profile.default_content_setting_values':{
        'notification':2
    }
}
chrome_options.add_experimental_option('prefs', prefs)
chrome_options.add_argument("disable-infobars")
driver = webdriver.Chrome()

driver.get('https://www.facebook.com/')
fb_email = sys.argv[1]
fb_password = sys.argv[2]
path = sys.argv[3]
content = sys.argv[4]
fb_watchers = sys.argv[5]
except_friends = sys.argv[6]

try:
    wait = WebDriverWait(driver, 10)

    def complete():
        complete_button = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[6]/div[1]/div/div[2]/div/div/div/div/div[1]/div[3]/div/div[2]/div[2]/div[2]/div/div/div[2]')))
        try:
            complete_button.click()
        except ElementClickInterceptedException:
            driver.execute_script("arguments[0].click()",complete_button)
        time.sleep(1.5)

    def share():
        share_button = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[1]/div/div[1]/div/div[5]/div/div/div[3]/form/div/div/div[1]/div/div[4]/div[2]/div[2]/div[1]/div')))
        try:
            share_button.click()
        except ElementClickInterceptedException:
            driver.execute_script("arguments[0].click();", share_button)
            print('upload process')
        time.sleep(100)

    def click_add_friends():
        click_button = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[7]/div[1]/div/div[2]/div/div/div/div/div[2]/div/div[3]/div[1]/div/div[2]/div/div[1]/div[2]/div/div/div/div/div/div[1]/div[2]/div[1]')))
        try:
            click_button.click()
        except ElementClickInterceptedException:
            driver.execute_script("argument[0].click();",click_button)
        time.sleep(1)

    def add_friends(friend):
        add_button = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[6]/div[1]/div/div[2]/div/div/div/div/div[2]/div/div[3]/div[1]/div[1]/div[1]/div/div/label/input')))
        # try:
        add_button.send_keys(friend)
        # except ElementClickInterceptedException:
        #     driver.execute_script("arguments[0].value= friend;", add_button)
        time.sleep(1.7)
        click_add_friends()

    email = wait.until(EC.presence_of_element_located((By.ID,'email')))
    email.send_keys(fb_email)
    time.sleep(1.1)

    password = wait.until(EC.presence_of_element_located((By.ID,'pass')))
    password.send_keys(fb_password)
    time.sleep(0.8)

    login = wait.until(EC.presence_of_element_located((By.NAME,'login')))
    login.click()
    time.sleep(5)
    print('log in success')

    add_new_post = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[1]/div/div[1]/div/div[2]/div[5]/div[1]/div[1]/div[2]/span/div')))
    try:
        add_new_post.click()
    except ElementClickInterceptedException:
        driver.execute_script("arguments[0].click();", add_new_post)
    time.sleep(6)

    reels = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[1]/div/div[1]/div/div[2]/div[5]/div[2]/div/div[2]/div[1]/div[1]/div/div/div/div/div/div/div/div[2]/div[3]/a/div[1]')))
    try:
        reels.click()
    except ElementClickInterceptedException:
        driver.execute_script("arguments[0].click();", reels)
    time.sleep(4)

    add_video = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[1]/div/div[1]/div/div[5]/div/div/div[3]/form/div/div/div[1]/div/div[3]/div[1]/div[2]/div/div/div[1]/div/input')))
    try:
        add_video.send_keys(path)
    except ElementClickInterceptedException:
        driver.execute_script("arguments[0].value='path';", add_video)
    time.sleep(2)

    next_step = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[1]/div/div[1]/div/div[5]/div/div/div[3]/form/div/div/div[1]/div/div[4]/div[2]/div/div/div')))
    try:
        next_step.click()
    except ElementClickInterceptedException:
        driver.execute_script("arguments[0].click();", next_step)
    print('next_step')
    time.sleep(1.5)

    next_step2 = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[1]/div/div[1]/div/div[5]/div/div/div[3]/form/div/div/div[1]/div/div[4]/div[2]/div[2]/div[1]/div')))
    try:
        next_step2.click()
    except ElementClickInterceptedException:
        driver.execute_script("arguments[0].click();", next_step2)
    time.sleep(1.3)

    write_content = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[1]/div/div[1]/div/div[5]/div/div/div[3]/form/div/div/div[1]/div/div[3]/div[1]/div[2]/div/div/div/div/div[1]/div[1]/div[1]/div[1]')))
    try:
        write_content.send_keys(content)
    except ElementClickInterceptedException:
        driver.execute_script("arguments[0].value='test content';", write_content)
    time.sleep(10)

    fb_watcher = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[1]/div/div[1]/div/div[5]/div/div/div[3]/form/div/div/div[1]/div/div[3]/div[1]/div[2]/div/div/div/div/div[2]/div[2]/div/div/div/div[1]/div')))
    try:
        fb_watcher.click()
    except ElementClickInterceptedException:
        driver.execute_script("arguments[0].click()",fb_watcher)
    time.sleep(60)

    if(fb_watchers == "everyone"):
        everyone = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[6]/div[1]/div/div[2]/div/div/div/div/div[1]/div[3]/div/div[1]/div/div/div[2]/div/div[1]/div')))
        try:
            everyone.click()
        except ElementClickInterceptedException:
            driver.execute_script("arguments[0].click()",everyone)
        time.sleep(2.1)
        complete()
        share()
        
    elif(fb_watchers == "allFriends"):
        allFriends = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[6]/div[1]/div/div[2]/div/div/div/div/div[1]/div[3]/div/div[1]/div/div/div[2]/div/div[2]/div')))
        try:
            allFriends.click()
        except ElementClickInterceptedException:
            driver.execute_script("arguments[0].click()",allFriends)
        time.sleep(2.1)
        complete()
        share()
        
#/html/body/div[6]/div[1]/div/div[2]/div/div/div/div/div[1]/div[3]/div/div[1]/div/div/div[2]/div/div[1]/div/div[1]

#/html/body/div[6]/div[1]/div/div[2]/div/div/div/div/div[1]/div[3]/div/div[1]/div/div/div[2]/div/div[3]/div/div[1]/div[2]
    elif(fb_watchers == "someFriends"):
        print('somefriends')
        someFriends = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[7]/div[1]/div/div[2]/div/div/div/div/div[1]/div[3]/div/div[1]/div/div/div[2]/div/div[3]/div/div[1]')))
        try:
            someFriends.click()
        except ElementClickInterceptedException:
            driver.execute_script("arguments[0].click()",someFriends)
        time.sleep(2.1)
        for i in range(len(except_friends)):
            add_friends(except_friends[i])
            print(except_friends[i])
        complete()
        share()
        

    elif(fb_watchers == "myself"):
        myself = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[6]/div[1]/div/div[2]/div/div/div/div/div[1]/div[3]/div/div[1]/div/div/div[2]/div/div[4]/div/div[1]/div[2]')))
        try:
            myself.click()
        except ElementClickInterceptedException:
            driver.execute_script("arguments[0].click()",myself)
        time.sleep(2.1)
        complete()
        share()

    
finally:
    driver.quit()