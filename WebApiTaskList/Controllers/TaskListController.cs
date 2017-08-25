﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiTaskList.Migrations;
using WebApiTaskList.Model;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using System.Text;
using System.Data.Entity;

namespace WebApiTaskList.Controllers
{
    public class TaskListController : ApiController
    {

        public HttpResponseMessage Get()
        {
            Context context = new Context();

            var taskListSelect = from tl in context.TaskList select tl;

            return new HttpResponseMessage()
            {
                Content = new StringContent(JArray.FromObject(taskListSelect).ToString(), Encoding.UTF8, "application/json")
            };
        }

        public async Task<IHttpActionResult> Post(TaskList taskListRequest)
        {
            string menssage;
            int id = 0;
            string title="";
            string description = "";

            try
            {
                Context context = new Context();

                if (taskListRequest.id == 0)
                {
                    context.TaskList.Add(taskListRequest);
                }
                else
                {
                    context.TaskList.Attach(taskListRequest);
                    context.Entry(taskListRequest).State = EntityState.Modified;
                }

                context.SaveChanges();

                id = taskListRequest.id;
                title = taskListRequest.title;
                description = taskListRequest.description;

                context.Dispose();
                menssage = "Task salva com sucesso";
            }
            catch(Exception ex)
            {
                menssage = ex.Message;
            }

            return Json(new { id = id, title = title, description= description, mensagem = menssage });
        }
        
        public async Task<IHttpActionResult> Delete(int id)
        {

            string menssage = "";

            try
            {
                Context context = new Context();

                TaskList taskDelete = new TaskList();
                taskDelete.id = id;
                context.TaskList.Attach(taskDelete);
                context.TaskList.Remove(taskDelete);
                context.SaveChanges();
                context.Dispose();

            } catch(Exception ex)
            {
                menssage = ex.Message;
            }

            return Json(new { id = id });
        }
    }
}
