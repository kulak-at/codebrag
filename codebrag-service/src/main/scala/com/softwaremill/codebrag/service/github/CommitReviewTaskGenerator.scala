package com.softwaremill.codebrag.service.github

import com.softwaremill.codebrag.dao.{CommitReviewTaskDAO, UserDAO}
import com.softwaremill.codebrag.domain.CommitInfo

class CommitReviewTaskGenerator(userDao: UserDAO, commitToReviewDao: CommitReviewTaskDAO) {

  def createReviewTasksFor(commit: CommitInfo) {
    commit.createReviewTasksFor(repositoryUsers()).foreach(reviewTask => commitToReviewDao.save(reviewTask))
  }

  def repositoryUsers() = {
    // currently all users are repository users
    // change it as soon as access control and multiple repositories will be introduced
    userDao.findAll().map(_.id)
  }

}