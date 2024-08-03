import sys 

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

driver = webdriver.Chrome()
chrome_options = Options()
chrome_options.add_argument("--headless")

url = 'https://www.instagram.com/'
driver.get(url)


username = sys.argv[1]
password = sys.argv[2]
post_path = sys.argv[3]
content = sys.argv[4]
    
try:
    wait = WebDriverWait(driver, 10)
    username_field = wait.until(EC.presence_of_element_located((By.NAME, "username")))
    username_field.send_keys(username)
    time.sleep(1.1)

    password_field = wait.until(EC.presence_of_element_located((By.NAME, "password")))
    password_field.send_keys(password)
    time.sleep(2)

    login_ = wait.until(EC.presence_of_element_located((By.XPATH,'//*[@id="loginForm"]/div/div[3]/button/div')))
    login_.click()
    time.sleep(5)

    store_ = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div[2]/section/main/div/div/div/div/div')))
    store_.click()
    time.sleep(1.5)

    noti_ = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[3]/div[1]/div/div[2]/div/div/div/div/div[2]/div/div/div[3]/button[2]')))
    noti_.click()
    
    time.sleep(3)

    new_post_button = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div[1]/div/div/div/div/div[2]/div[7]/div/span/div/a/div/div[1]/div/div')))
    new_post_button.click()
    time.sleep(2)

    add_new_post = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div[1]/div/div/div/div/div[2]/div[7]/div/span/div/div/div/div[1]/a[1]/div[1]/div/div/div[1]/div/div')))
    add_new_post.click()
    time.sleep(1.5)

    # upload_post_button = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[6]/div[1]/div/div[3]/div/div/div/div/div/div/div/div[2]/div[1]/div/div/div[2]/div/button')))
    # upload_post_button.click()
    # time.sleep(1.3)
    
    upload_post_content = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[6]/div[1]/div/div[3]/div/div/div/div/div/div/div/div[2]/div[1]/form/input')))
    upload_post_content.send_keys(post_path)
    time.sleep(2)
    
    sure_reel = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[6]/div[2]/div/div/div[1]/div/div[2]/div/div/div/div/div[2]/div/div/div[3]/div/div[4]/button')))
    sure_reel.click()
    time.sleep(2.5)

    next_step = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[6]/div[1]/div/div[3]/div/div/div/div/div/div/div/div[1]/div/div/div/div[3]/div/div')))
    next_step.click()
    time.sleep(2)
    print('nextstep')

    next_step2 = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[6]/div[1]/div/div[3]/div/div/div/div/div/div/div/div[1]/div/div/div/div[3]/div/div')))
    next_step2.click()
    time.sleep(1)
    print('nextstep2')

    write_content = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[6]/div[1]/div/div[3]/div/div/div/div/div/div/div/div[2]/div[2]/div/div/div/div[1]/div[2]/div/div[1]/div[1]')))
    write_content.send_keys(content)
    time.sleep(1.2)

    share_button = wait.until(EC.presence_of_element_located((By.XPATH,'/html/body/div[6]/div[1]/div/div[3]/div/div/div/div/div/div/div/div[1]/div/div/div/div[3]/div/div')))
    share_button.click()
    time.sleep(120)
    print('upoad success')
finally:
    driver.quit()