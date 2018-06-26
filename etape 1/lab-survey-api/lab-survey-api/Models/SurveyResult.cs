using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace lab
{
    public class SurveyResult
    {
        [JsonProperty("id")]
        public Guid Id { get; set; }

        [JsonProperty("completedSteps")]
        public Dictionary<int, DateTimeOffset> CompletedSteps { get; set; }
    }
}