package com.softwaremill.codebrag

import org.json4s.JsonDSL._
import org.json4s.jackson.JsonMethods._
import org.json4s.JsonAST.JValue
import org.scalatra.test.scalatest.ScalatraFlatSpec
import org.scalatest.mock.MockitoSugar
import org.json4s.jackson.Serialization
import com.softwaremill.codebrag.rest.CodebragJsonEndpoint

trait CodebragServletSpec extends ScalatraFlatSpec with MockitoSugar {

  val defaultJsonHeaders = Map("Content-Type" -> "application/json;charset=UTF-8")

  def mapToJson[T <% JValue](map: Map[String, T]): Array[Byte] = {
    compact(map2jvalue(map)).getBytes("UTF-8")
  }

  def stringToJson(string: String): JValue = {
    parse(string)
  }

  def mapToStringifiedJson[T <% JValue](map: Map[String, T]): String = {
    compact(map2jvalue(map))
  }

  def asJson(objToJson: AnyRef) = {
    implicit val formats = CodebragJsonEndpoint.jsonFormats
    Serialization.write(objToJson)
  }

}
