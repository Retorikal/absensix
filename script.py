import datetime
from selenium.common.exceptions import NoSuchElementException


def login(driver, config):
    # Navigate to the URL
    login = 'https://login.itb.ac.id/cas/login'
    service = '?service=https://akademik.itb.ac.id/login/INA'
    returnTo = '?returnTo=https://akademik.itb.ac.id/app/mahasiswa:{}%252B2020-1/kelas/pertemuan/jadwal/mahasiswa'.format(
        config["NIM"])
    driver.get(login + service + returnTo)

    # Acquire the login DOM
    username = driver.find_element_by_name('username')
    password = driver.find_element_by_name('password')
    submit = driver.find_element_by_name('submit')

    # Fill the login form and submit
    username.send_keys(config['Username'])
    password.send_keys(config['Password'])
    submit.click()


def get_active_course(driver):
    # Get current time
    current_time = datetime.datetime.now().time()

    # Get all today courses
    courses = driver.find_elements_by_css_selector(
        'td.bg-info a.linkpertemuan')
    for course in courses:
        # Get course start and end time in datetime.time type
        course_duration = course.text.split()[0]  # Ex: 13:00-14:00
        course_start = datetime.time.fromisoformat(
            course_duration.split('-')[0])
        course_end = datetime.time.fromisoformat(course_duration.split('-')[1])

        # Raw course string with format: [<code>, <name>]
        raw = course.get_attribute('data-kuliah').split(maxsplit=1)
        course_code = raw[0]  # Ex: TF3103
        course_name = raw[1]  # Ex: Mekanika Kuantum

        # Return course if current time exist in the course time range
        if current_time > course_start and current_time < course_end:
            return course_code, course_name

    # If no active course found, raise an error
    raise Exception('No active course found')


def attend(driver):
    course = get_active_course(driver)
    course_str = ' '.join(course)
    # Go to course detail page
    link = driver.find_element_by_css_selector(
        'td.bg-info a.linkpertemuan[data-kuliah="{}"]'.format(course_str))
    link.click()

    # Mark the course attendance
    try:
        presence = driver.find_element_by_css_selector('button[type="submit"]')
        # Attendance not yet marked
        if presence.get_attribute('id') == 'form_hadir':
            presence.click()
            message = """
            {}
            Kehadiran berhasil ditandai
            """.format(course_str)
        # Attendance already marked
        elif presence.get_attribute('id') == 'form_tidakhadir':
            message = """
            {}
            Kehadiran sudah ditandai
            """.format(course_str)
    except NoSuchElementException:
        # Attendance not yet opened
        message = """
        {}
        Kehadiran masih belum dibuka
        """.format(course_str)
    finally:
        print(message)
