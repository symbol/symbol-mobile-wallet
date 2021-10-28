pipeline {
    agent { label 'macos' }
    
    options {
        skipStagesAfterUnstable()
    }

    parameters {
        string(name: 'VERSION_NUMBER', defaultValue: '4.4.2', description: 'Version Number')
        string(name: 'BUILD_NUMBER', defaultValue: '59', description: 'Build Number')
        string(name: 'DEPLOY_BETA_BRANCH', defaultValue: 'dev', description: 'Deploy Beta Branch Name')
        choice(
            name: 'TARGET_OS',
            choices: ['All', 'IOS', 'Android'],
            description: 'Target Environment'
        )
    }
    
    environment {
        RUNNING_ON_CI = 'true'
        VERSION_NUMBER = "${params.VERSION_NUMBER}"
        BUILD_NUMBER = "${params.BUILD_NUMBER}"
        DEPLOY_BETA_BRANCH = "${params.DEPLOY_BETA_BRANCH}"
        TARGET_OS = "${params.TARGET_OS}"
        MATCH_GIT_BASIC_AUTHORIZATION = credentials('GHUB_CREDS_SECRET')
        MATCH_PASSWORD = credentials('MATCH_PASSWORD')
        FASTLANE_KEYCHAIN = 'fastlane.keychain'
        FASTLANE_KEYCHAIN_PASSWORD = credentials("FASTLANE_KEYCHAIN_PASSWORD")
        APP_STORE_CONNECT_API_KEY_KEY_ID = credentials("APP_STORE_CONNECT_API_KEY_KEY_ID")
        APP_STORE_CONNECT_API_KEY_ISSUER_ID = credentials("APP_STORE_CONNECT_API_KEY_ISSUER_ID")
        APP_STORE_CONNECT_API_KEY_KEY = credentials("APP_STORE_CONNECT_API_KEY_KEY")
    }

    stages {
        stage('Install') {
            steps {
                sh "cp env/default.json.example env/default.json"
                // Run yarn install for the dependencies
                sh "yarn cache clean && yarn install --network-concurrency 1"
                sh "npx jetify" // for android
            }
        }

        stage('Build') {
            parallel {
                stage('Build - IOS') {
                    when {
                        expression {
                            BRANCH_NAME == DEPLOY_BETA_BRANCH && (TARGET_OS == 'All' || TARGET_OS == 'IOS')
                        }
                    }
                    steps {
                        sh "cd ios && bundle install"
                        sh "cd ios && bundle exec pod install"
                    }
                }
                stage('Build - Android') {
                    when {
                        expression {
                            TARGET_OS == 'All' || TARGET_OS == 'Android'
                        }
                    }
                    steps {
                        // copy key.properties and copy keystore file
                        withCredentials([file(credentialsId: 'ANDROID_KEY_PROPERTIES', variable: 'android_key_properties'),
                                        file(credentialsId: 'ANDROID_KEY_PROPERTIES_STORE_FILE', variable: 'release_keystore')]) {
                            sh 'cp $android_key_properties ./android/app/key.properties'
                            sh 'cp $release_keystore ./android/app/release.keystore'
                            sh "cd android && ./gradlew assembleProdRelease -PBUILD_NUMBER=${BUILD_NUMBER}"
                            sh "echo 'Build completed and .apk file is generated. Version:${VERSION_NUMBER}, Build:${BUILD_NUMBER}'"
                        }
                    }
                }
            }
        }

        stage ('Test') {
            steps {
                sh "echo 'Currently there are no tests to run!'"
            }
        }

        // deploy to testnet
        stage ('Deploy IOS - Alpha version') {
            when {
                expression {
                    BRANCH_NAME == DEPLOY_BETA_BRANCH && (TARGET_OS == 'All' || TARGET_OS == 'IOS')
                }
            }
            steps {
                sh 'cd ios && export APP_STORE_CONNECT_API_KEY_KEY_ID=${APP_STORE_CONNECT_API_KEY_KEY_ID} && export APP_STORE_CONNECT_API_KEY_ISSUER_ID=${APP_STORE_CONNECT_API_KEY_ISSUER_ID} && export APP_STORE_CONNECT_API_KEY_KEY=${APP_STORE_CONNECT_API_KEY_KEY} && export FASTLANE_KEYCHAIN=${FASTLANE_KEYCHAIN} && export FASTLANE_KEYCHAIN_PASSWORD=${FASTLANE_KEYCHAIN_PASSWORD} && export RUNNING_ON_CI=${RUNNING_ON_CI} && export BUILD_NUMBER=${BUILD_NUMBER} && export VERSION_NUMBER=${VERSION_NUMBER} && bundle exec fastlane beta'
                sh "echo 'Deployed to TestFlight. Version:${VERSION_NUMBER}, Build:${BUILD_NUMBER}'"
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'android/app/build/outputs/apk/prod/release/*.apk', allowEmptyArchive: true
            archiveArtifacts artifacts: 'ios/output/*.ipa', allowEmptyArchive: true
            cleanWs()
        }
    }
}
